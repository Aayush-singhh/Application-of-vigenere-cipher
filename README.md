# Vigenère Cipher Application

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## Description
The Vigenère Cipher Application is an interactive polyalphabetic encryption and decryption educational tool. It allows users to encrypt plain text and decrypt cipher text using a keyword, providing a hands-on way to learn about historical cryptography techniques and substitution ciphers.

## Features List
1. Interactive text encryption
2. Interactive text decryption
3. Real-time processing
4. Case-preservation of input text
5. Handling of non-alphabetical characters (spaces, numbers, symbols remain unchanged)
6. Dynamic key expansion visualization
7. Formula breakdown display
8. Vigenère tableau reference
9. Copy to clipboard functionality
10. Input validation and error handling
11. Responsive design for mobile and desktop
12. Educational tooltips
13. Step-by-step calculation breakdown
14. Clear/reset functionality
15. Key validity checking (only alphabetical keys allowed)
16. Auto-resizing text areas
17. Dark mode / Light mode support (placeholder)
18. Clean and modern user interface
19. Offline capability (runs entirely in browser)
20. No data tracking or external API calls

## Technologies
- **HTML5**: For semantic structure
- **CSS3**: For styling and layout
- **JavaScript (ES6+)**: For cryptographic logic and DOM manipulation

## Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/Aayush-singhh/Application-of-vigenere-cipher.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Application-of-vigenere-cipher
   ```

## How to Run
This application requires no build tools or server. Simply open `index.html` in any modern web browser to start using the application.

## How Encryption Works
The Vigenère cipher encrypts alphabetic text by using a series of interwoven Caesar ciphers, based on the letters of a keyword.
Mathematically, the encryption formula is:
**C = (P + K) mod 26**

Where:
- `C` is the cipher text letter index (0-25).
- `P` is the plain text letter index (0-25).
- `K` is the key letter index (0-25).
- `mod 26` ensures the result wraps around the alphabet.

## How Decryption Works
Decryption reverses the encryption process by subtracting the key letter index from the cipher text letter index.
The decryption formula is:
**P = (C - K + 26) mod 26**

Where:
- `+ 26` ensures the result is a positive number before taking the modulo, handling negative differences correctly.

## Mathematical Formulas with Examples
Let `A = 0, B = 1, ..., Z = 25`.

**Encryption Example:**
Encrypt 'T' (19) with key 'L' (11).
C = (19 + 11) mod 26 = 30 mod 26 = 4.
4 corresponds to 'E'.

**Decryption Example:**
Decrypt 'E' (4) with key 'L' (11).
P = (4 - 11 + 26) mod 26 = 19 mod 26 = 19.
19 corresponds to 'T'.

## Complete Example
**Plain Text:** `ATTACKATDAWN`
**Key:** `LEMON` (repeated to match text length: `LEMONLEMONLE`)

| Plain Text | Key | Plain Index (P) | Key Index (K) | (P + K) mod 26 | Cipher Index (C) | Cipher Text |
|---|---|---|---|---|---|---|
| A | L | 0 | 11 | 11 | 11 | L |
| T | E | 19 | 4 | 23 | 23 | X |
| T | M | 19 | 12 | 31 mod 26 | 5 | F |
| A | O | 0 | 14 | 14 | 14 | O |
| C | N | 2 | 13 | 15 | 15 | P |
| K | L | 10 | 11 | 21 | 21 | V |
| A | E | 0 | 4 | 4 | 4 | E |
| T | M | 19 | 12 | 31 mod 26 | 5 | F |
| D | O | 3 | 14 | 17 | 17 | R |
| A | N | 0 | 13 | 13 | 13 | N |
| W | L | 22 | 11 | 33 mod 26 | 7 | H |
| N | E | 13 | 4 | 17 | 17 | R |

**Result:** `LXFOPVEFRNHR`

## Project Architecture
```text
vigenere-cipher/
├── index.html          # Main application UI
├── css/
│   └── style.css       # Stylesheets
├── js/
│   ├── app.js          # DOM manipulation and event listeners
│   └── cipher.js       # Core cryptographic algorithms
├── docs/               # Detailed documentation
│   ├── algorithm.md    # Algorithm explanation
│   └── project-report.md # Formal college report
└── README.md           # Project readme
```

## Testing
The application has been verified against the following test cases:
1. **Basic Encryption**: "HELLO" + key "KEY" -> "RIJVS"
2. **Basic Decryption**: "RIJVS" + key "KEY" -> "HELLO"
3. **Case Preservation**: "Hello World" + key "KEY" -> "Rijvs Uyvjn"
4. **Non-Alphabetical Characters**: "Wait, what? 123" + key "ABC" -> "Wbkv, wibu? 123"
5. **Key Shorter than Text**: "ATTACKATDAWN" + key "LEMON" -> "LXFOPVEFRNHR"
6. **Key Longer than Text**: "HI" + key "LONGKEY" -> "SS"
7. **Empty Input**: "" + key "KEY" -> ""
8. **Invalid Key (Numbers)**: "TEXT" + key "K3Y" -> Error/Rejection
9. **Single Character Key**: "HELLO" + key "A" -> "HELLO" (Identity)
10. **Z Wrap-around**: "ZOO" + key "B" -> "APP"

## Limitations
- **Educational Only**: This tool is designed for learning and understanding classical cryptography.
- **English Alphabet**: Currently limited to the 26-letter standard English alphabet (A-Z).
- **No Modern Security**: The Vigenère cipher is highly vulnerable to modern cryptanalysis and should not be used to protect sensitive data.

## Security Considerations
- The application is entirely client-side; no data is sent to a server.
- Key storage is non-existent; everything is processed in memory.
- **DO NOT USE FOR PRODUCTION**: As a historical cipher, it is easily broken using frequency analysis, Kasiski examination, and the Friedman test.

## Future Scope
- Interactive AES/DES comparison module to contrast historical vs modern encryption.
- File encryption capabilities for text files.
- Multi-language support (supporting varied alphabets).
- Mobile application development.

## Screenshots
![Encryption Interface Placeholder](placeholder-encryption.png)
![Decryption Interface Placeholder](placeholder-decryption.png)

## Author
Aaysuh Singh


