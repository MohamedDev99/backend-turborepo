import z from "zod";

export const createConversationSchema = z.object({
    participants: z
        .array(
            z.string({
                required_error: "😱 You forgot to add a participant",
                invalid_type_error: "🚨 Type of participant should be a string",
            })
        )
        .min(2, { message: "😱 Must be at least 2 participants" }),
    messages: z
        .array(
            z
                .string({
                    invalid_type_error: "🚨 Type of message should be a string",
                })
                .optional()
        )
        .default([]),
});

export const updateConversationSchema = createConversationSchema.partial();
