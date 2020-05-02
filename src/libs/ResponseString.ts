export  const ResponseString:any = {
    DUPLICATE_USER: "Exist user. Do you not remenber your password?",
    NOT_ARGUMENT: "No arguments found",
    USER_NOT_FOUND: "User not found",
    INVALID_FIELD: "Field {0} is required",
    OPTIONAL_FIELD: "Field {0} is optional",
    PASSWORD_HASH_ERROR: "Error make secure store password",
    PASWORD_INVALID: "Invalid Password",
    NOT_FOUND : "Not FOUND",
    JSON_MALFORMED : "JSON malformed",
    LANG_UNSOPORTED : (str:string) => `Unsopoerted lang. Show default lang ${str}`,
    LANG_INVALID : 'The lang received are not valid',
    GENERIC_NOTFOUND: (str:string) => `${str} not found`
}
