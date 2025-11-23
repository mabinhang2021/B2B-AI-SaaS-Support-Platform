import { WidgetSettingSchema } from "./constants";
import { z } from "zod";

export type FormSchema = z.infer<typeof WidgetSettingSchema>;