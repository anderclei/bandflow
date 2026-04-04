import { z } from "zod";
import { verifyBandAccess } from "./verifyBandAccess";
import { logActivity } from "./activityLog";

/**
 * Standard response format for all Server Actions.
 */
export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Higher-order function to create a protected Server Action.
 * Automatically validates session, tenant access, and schema.
 */
export function createSafeAction<TInput extends z.ZodTypeAny, TOutput>(
  schema: TInput,
  handler: (data: z.infer<TInput>, context: { bandId: string; userId: string; plan: string }) => Promise<TOutput>,
  options?: {
    audit?: {
      action: string;
      entity: string;
      details: (data: z.infer<TInput>, result: TOutput) => string;
    };
    requiredRole?: "ADMIN" | "MEMBER";
  }
) {
  return async (data: any): Promise<ActionResponse<TOutput> | any> => {
    try {
      // 1. Authorization & Tenant Isolation
      const { bandId, session, plan, membership } = await verifyBandAccess(options?.requiredRole);
      
      // 2. Data Parsing (Handle FormData with multi-value support)
      let parsedData = data;
      if (data instanceof FormData) {
        const obj: Record<string, any> = {};
        data.forEach((value, key) => {
          if (key.endsWith("[]") || obj[key] !== undefined) {
            const cleanKey = key.replace("[]", "");
            if (!Array.isArray(obj[cleanKey])) {
              obj[cleanKey] = obj[cleanKey] !== undefined ? [obj[cleanKey]] : [];
            }
            obj[cleanKey].push(value);
          } else {
            obj[key] = value;
          }
        });
        parsedData = obj;
      }

      // 3. Validation
      const result = schema.safeParse(parsedData);
      if (!result.success) {
        const errorMsg = result.error.issues
          .map((issue: z.ZodIssue) => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ');
        return { success: false, error: `Dados inválidos: ${errorMsg}` };
      }

      // 4. Execution
      const userId = session.user?.id;
      if (!userId) throw new Error("Sessão inválida: Usuário não identificado.");

      const output = await handler(result.data, { 
        bandId, 
        userId,
        plan: plan || "ESSENTIAL"
      });

      // 5. Optional Audit Logging (Pass parsed data)
      if (options?.audit) {
        await logActivity(
          options.audit.action,
          options.audit.entity,
          options.audit.details(result.data, output),
          bandId
        );
      }

      return { success: true, data: output };
    } catch (e: any) {
      console.error("[SafeAction] Error:", e.message);
      return { 
        success: false, 
        error: e.message || "Ocorreu um erro inesperado ao processar a solicitação." 
      };
    }
  };
}
