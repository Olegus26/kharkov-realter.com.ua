{
    "name": "Transaction",
        "type": "object",
            "properties": {
        "title": {
            "type": "string",
                "description": "Transaction description"
        },
        "amount": {
            "type": "number",
                "description": "Transaction amount"
        },
        "type": {
            "type": "string",
                "enum": [
                    "income",
                    "expense"
                ],
                    "description": "Transaction type"
        },
        "category": {
            "type": "string",
                "enum": [
                    "salary",
                    "freelance",
                    "investments",
                    "gifts",
                    "other_income",
                    "food",
                    "transport",
                    "housing",
                    "utilities",
                    "entertainment",
                    "health",
                    "education",
                    "clothing",
                    "subscriptions",
                    "other_expense"
                ],
                    "description": "Transaction category"
        },
        "date": {
            "type": "string",
                "format": "date",
                    "description": "Transaction date"
        },
        "notes": {
            "type": "string",
                "description": "Additional notes"
        }
    },
    "required": [
        "title",
        "amount",
        "type",
        "category",
        "date"
    ]
}