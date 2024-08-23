export function sanitizeString(input: string): string {
    // Replace any single quotes with two single quotes to prevent SQL injection
    let sanitized = input.replace(/'/g, "''");

    // Optionally, you can also escape other SQL special characters
    sanitized = sanitized.replace(/;/g, '')
                         .replace(/--/g, '')
                         .replace(/\/\*/g, '')
                         .replace(/\*\//g, '')
                         .replace(/\\x00/g, '')
                         .replace(/\\n/g, '')
                         .replace(/\\r/g, '')
                         .replace(/\\Z/g, '')
                         .replace(/\\/g, '\\\\');

    return sanitized.trim();
}