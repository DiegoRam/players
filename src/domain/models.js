exports.models = {
    "Player": {
        "id": "Player",
        "required": ["id", "fullname"],
        "properties": {
            "id": {
                "type": "integer",
                "format": "int64",
                "description": "Unique identifier"
            },
            "fullname": {
                "type" : "string",
                "description" : "Player full name"
            }
        }
    }
};