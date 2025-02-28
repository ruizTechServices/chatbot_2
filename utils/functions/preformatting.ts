export function preformat(text: string) {
    return text
        .replace(/[^\w\s]|_/g, '')
        .toLowerCase();
}

//This function takes a string and returns a preformatted version of it
//The format is as follows:
// 1. All non-alphanumeric characters are removed
// 2. All characters are converted to lowercase