/**
 * Input sanitization utilities
 * Prevents XSS and injection attacks
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes script tags, event handlers, and dangerous attributes
 */
function sanitizeHtml(input: string): string {
  const div = document.createElement('div')
  div.textContent = input
  return div.innerHTML
}

/**
 * Sanitize user input for display
 * Trims whitespace and escapes HTML
 */
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
}

/**
 * Sanitize file name to prevent path traversal
 */
function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars
    .replace(/\.\./g, '_') // Prevent path traversal
    .substring(0, 255) // Limit length
}

/**
 * Validate and sanitize URL
 * Only allows http, https, and relative URLs
 */
function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    
    // Only allow http, https, or relative URLs
    if (!['http:', 'https:', ''].includes(parsed.protocol)) {
      return null
    }
    
    return parsed.href
  } catch {
    // If it can't be parsed as URL, check if it's a relative path
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return url
    }
    return null
  }
}

/**
 * Sanitize text for API requests
 * Removes control characters and limits length
 */
function sanitizeForApi(text: string, maxLength = 10000): string {
  return text
    .slice(0, maxLength)
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim()
}

export {
  sanitizeHtml,
  sanitizeInput,
  sanitizeFileName,
  sanitizeUrl,
  sanitizeForApi,
}
