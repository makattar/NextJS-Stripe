import { validateZodSchema } from "@/lib/common/Validate";
import { BAD_REQUEST_CODE } from "@/lib/constants/ApiStatusCode";
import { AuthLoginSchema } from "@/lib/schemas/AuthSchema";
import { AuthService } from "@/lib/services/AuthService";

export async function POST(req: Request, res: Response) {
  const reqBody = await req.json();
  const authService = new AuthService();

  const validation = validateZodSchema(reqBody, AuthLoginSchema);
  if (!validation.success) {
    return Response.json(
      { ...validation.errors },
      { status: BAD_REQUEST_CODE }
    );
  }

  const authenticatedData = await authService.login(validation.result);
  if (!authenticatedData.success) {
    return Response.json(
      { ...authenticatedData.error },
      { status: authenticatedData.statusCode }
    );
  }

  return Response.json(authenticatedData.data, {
    status: authenticatedData.statusCode,
    headers: {
      "Set-Cookie": authenticatedData?.data?.sessionCookie.serialize() ?? ""
    }
  });
}