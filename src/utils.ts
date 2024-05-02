import { CONSTANTS } from '@constants'

interface CookieOptions {
  expires?: number | Date
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}


 function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

 type Order = 'asc' | 'desc';

 function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

/**
 * Function to set cookie using name, value and options
 * @param name: string
 * @param value: string
 * @param options: CookieOptions
 */
export const setCookie = (
  name: string,
  value: string,
  options?: CookieOptions
): void => {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (options) {
    if (options.expires) {
      const expires =
        options.expires instanceof Date
          ? options.expires.toUTCString()
          : new Date(Date.now() + options.expires * 1000).toUTCString()
      cookieString += `; expires=${expires}`
    }

    if (options.path) {
      cookieString += `; path=${options.path}`
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`
    }

    if (options.secure) {
      cookieString += '; secure'
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`
    }
  }
  document.cookie = cookieString
}

/**
 * Function to get from cookies using name
 * @param name: string
 * @return {string}
 */
export const getCookie = (name: string) =>
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''

/**
 * Function to remove a cookie using name
 * @param name: string
 * @param options?: CookieOptions
 */
export const removeCookie = (name: string, options?: CookieOptions): void => {
  // Set the expiration date to a past date to remove the cookie
  const pastExpiration = new Date(0)

  // Call the setCookie function with the past expiration date to remove the cookie
  setCookie(name, '', { ...options, expires: pastExpiration })
}

/**
 * Function to set in session storage with key and value
 * @param storageKey: string
 * @param val: any
 */
export const setSessionStorage = (storageKey: string, val: any) =>
  sessionStorage.setItem(
    `${CONSTANTS.app_identifier}_${storageKey}`,
    JSON.stringify(val)
  )

/**
 * Function to get from session storage using key
 * @param storageKey: string
 * @returns {any}
 */
export const getSessionStorage = (storageKey: string) => {
  const item = sessionStorage.getItem(
    `${CONSTANTS.app_identifier}_${storageKey}`
  )
  return item ? JSON.parse(item) : item
}

/**
 * Function to remove from session storage using key
 * @param storageKey: string
 */
export const removeSessionStorage = (storageKey: string) => {
  sessionStorage.removeItem(`${CONSTANTS.app_identifier}_${storageKey}`)
}

/**
 * Function to set in local storage with key and value
 * @param storageKey: string
 * @param val: any
 */
export const setLocalStorage = (storageKey: string, val: any) =>
  localStorage.setItem(`${CONSTANTS.app_identifier}_${storageKey}`, val)

/**
 * Function to get from local storage using key
 * @param storageKey: string
 */
export const getLocalStorage = (storageKey: string) =>
  localStorage.getItem(`${CONSTANTS.app_identifier}_${storageKey}`)

/**
 * Function to remove from local storage using key
 * @param storageKey: string
 */
export const removeLocalStorage = (storageKey: string) =>
  localStorage.removeItem(`${CONSTANTS.app_identifier}_${storageKey}`)

/**
 * Function to validate email using regex
 * @param email: string
 * @returns {boolean}
 */
export const validateEmail = (
  email: string,
  allowedDomains: Array<string>
): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z.-]+\.)+[a-zA-Z]{2,}$/

  if (emailRegex.test(email)) {
    const [, domain] = email.split('@')
    return allowedDomains.includes(domain)
  }
  return false
}

/**
 * Function to translate the String with Variable passed
 * @param text {string}
 * @param replaceData {Object | Array}
 * @returns {string}
 */
export const translate = (text: string, replaceData: any): string => {
  Object.keys(replaceData).forEach((key) => {
    const item = replaceData[key] || ''
    if (text) {
      text = text
        .replace(new RegExp(`{{${key}}}`, 'g'), item)
        .replace(new RegExp(`{{ ${key} }}`, 'g'), item)
    }
  })
  return text
}

/**
 * Function to convert first letter of each word in a string to capital letter
 * @param str {string}
 * @returns {string}
 */
export const titleCase = (str: string): string => {
  const splitStr = str.toLowerCase().split(' ')
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
  }
  // Directly return the joined string
  return splitStr.join(' ')
}

/**
 * Function to convert any string to camelCase
 * @param str {string}
 * @returns {string}
 */
export const camelCase = (str: string): string =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (selection: string, index: number) =>
      index === 0 ? selection.toLowerCase() : selection.toUpperCase()
    )
    .replace(/[^a-zA-Z0-9]+/g, '')

/**
 * Function to convert camelCase to Camel Case
 * @param str {string}
 * @returns {string}
 */
export const reverseCamelCase = (str: string): string =>
  str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())

/**
 * Function to generate random hex string of given length
 * @param size {string}
 * @returns {string}
 */
export const randomHexString = (size: number): string =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('')

/**
 * Function to convert column json to row json or vice-versa
 * @param originalJson {any}
 * @returns {any}
 */
export const jsonTranspose = (originalJson: any): any => {
  const resultJson: any = {}

  Object.keys(originalJson).forEach((item: any) => {
    Object.keys(originalJson[item]).forEach((subItem: any) => {
      resultJson[subItem] = {
        ...resultJson[subItem],
        [item]: originalJson[item][subItem],
      }
    })
  })
  return resultJson
}

/**
 * Function to convert json object values to array
 * @param obj {any}
 * @returns {any}
 */
export const ObjectToArray = (obj: any): any => Object.values(obj)

/**
 * Function to return an array with elements between range
 * @param start {number}
 * @param end {number}
 * @returns {Array<number>}
 */
export const rangeToArray = (start: number, end: number): Array<number> =>
  Array.apply(0, Array(end - start + 1)).map(
    (_element, index: number) => index + start
  )

/**
 * Function to convert file to Base64 string
 * @param files {Array<Blob>}
 * @returns {Promise<any[]>}
 */
export const fileToDataUrl = (files: Array<Blob>): Promise<any[]> => {
  const fileUrls: Promise<any>[] = files.map(
    (imgFile: Blob) =>
      new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(imgFile)
      })
  )
  return Promise.all(fileUrls)
}

/**
 * Function to sleep/pause js code
 * @param sec {number}
 * @returns {Promise<void>}
 */
export const sleep = (sec: number, callback = () => {}): Promise<void> =>
  new Promise((resolve) =>
    setTimeout(() => {
      callback()
      resolve()
    }, sec * 1000)
  )

/**
 * Function to get next multiple of 5 from a number
 * @param n: number
 * @returns number
 */
export const getNextMultipleOf5 = (n: number): number => {
  const remainder = n % 5
  return remainder === 0 ? n : n + (5 - remainder)
}

/**
 * Function to find 1st smaller element than the given target
 * @param arr {Array<any>}
 * @param target {number}
 * @param end {number}
 * @returns {number}
 */
export const firstSmallerElemIndx = (
  arr: Array<any>,
  target: number,
  end: number
): number => {
  // Minimum size of the array should be 1
  if (end === 0) return -1

  // If target lies beyond the max element, than the index of strictly smaller
  // value than target should be (end - 1)
  if (target > arr[end - 1]) return end - 1

  let start = 0

  let ansIndx = -1
  while (start <= end) {
    const mid = (start + end) / 2

    // Move to the left side if the target is smaller
    if (arr[mid] >= target) {
      end = mid - 1
    }

    // Move right side
    else {
      ansIndx = mid
      start = mid + 1
    }
  }
  return ansIndx
}

/**
 * Function to convert to consecutive ranges
 * @param inputArray {Array<number>}
 * @returns {Array<any>}
 */
export const consecutiveRanges = (inputArray: Array<number>): Array<any> => {
  let length: number = 1
  const list: Array<any> = []

  // If the array is empty,
  // return the list
  if (inputArray.length === 0) {
    return list
  }

  // Traverse the array from first position
  for (let i = 1; i <= inputArray.length; i++) {
    // Check the difference between the
    // current and the previous elements
    // If the difference doesn't equal to 1
    // just increment the length variable.
    if (i === inputArray.length || inputArray[i] - inputArray[i - 1] !== 1) {
      // If the range contains
      // only one element.
      // add it into the list.
      if (length === 1) {
        list.push(inputArray[i - length].toString())
      } else {
        // Build the range between the first
        // element of the range and the
        // current previous element as the
        // last range.
        list.push(`${inputArray[i - length]}-${inputArray[i - 1]}`)
      }
      // After finding the first range
      // initialize the length by 1 to
      // build the next range.
      length = 1
    } else {
      length++
    }
  }
  return list
}

/**
 * Function to convert JSON to XML
 * @param jsonData {any}
 * @param rootTagName {string}
 * @param itemWrapperTagName {string}
 * @returns {string}
 */
export const jsonToXml = (
  jsonData: any,
  rootTagName: string,
  itemWrapperTagName: string
): string => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>'
  xml += '<' + rootTagName + '>'
  if (Array.isArray(jsonData)) {
    jsonData.forEach((item, index) => {
      xml += `<${itemWrapperTagName}${index + 1}>`
      Object.keys(item).forEach((key) => {
        const tagName = key.replace(/_/g, '-')
        xml += '<' + tagName + '>' + item[key] + '</' + tagName + '>'
      })
      xml += `</${itemWrapperTagName}${index + 1}>`
    })
  } else {
    Object.keys(jsonData).forEach((key) => {
      const tagName = key.replace(/_/g, '-')
      xml += '<' + tagName + '>' + jsonData[key] + '</' + tagName + '>'
    })
  }
  xml += '</' + rootTagName + '>'
  return xml
}

/**
 * Function to create a downloadable file using file name, format and content
 * @param fileName {string}
 * @param fileFormat {string}
 * @param fileContent {string | BlobPart}
 */
export const downloadFile = (
  fileName: string,
  fileFormat: string,
  fileContent: string | BlobPart
) => {
  const file = new Blob([fileContent], {
    type: fileFormat,
  })
  const element = document.createElement('a')
  element.href = window.URL.createObjectURL(file)
  element.download = fileName
  document.body.appendChild(element) // Required for this to work in FireFox
  element.click()
}

/**
 * Function to call callback after some delay (debouncing)
 * @param fn: T
 * @param delay: number
 * @returns {any}
 */
export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
}

/**
 * Function to mask content in ROT13 value
 * @param str: string
 * @returns {string}
 */
export const maskString = (text: string): string => {
  let hex = ''
  for (let i = 0; i < text.length; i++) {
    hex += text.charCodeAt(i).toString(16)
  }
  return hex
}

/**
 * Function to unmask content from ROT13 value
 * @param encodedText: string
 * @returns {string}
 */
export const unmaskString = (encodedText: string): string => {
  let text = ''
  for (let i = 0; i < encodedText.length; i += 2) {
    text += String.fromCharCode(parseInt(encodedText.substr(i, 2), 16))
  }
  return text
}

/**
 * Function to check for HTML string
 * @param str: string
 * @returns {boolean}
 */
export const containsHTML = (str: string) => /<[a-z][\s\S]*>/i.test(str)

/**
 * Function to parse text from HTML string
 * @param str: string
 * @returns {string}
 */
export const parseTextFromHTML = (str: string): string => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(str, 'text/html')
  return doc.body.textContent || ''
}

/**
 * It takes a string, removes all HTML tags from it, and returns the result
 * @param {string} str - The string to be stripped of HTML tags.
 * @returns a string with all HTML tags removed.
 */
export const removeHTMLTags = (str: string): string => {
  return str.replace(/<\/?[^>]+(>|$)/gi, '')
}



 
