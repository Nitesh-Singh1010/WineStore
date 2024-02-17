export default class ApiService {
  constructor() {}

  /**
   * Function is used to make api calls
   * @param arg1 {string}
   * @param arg2 {string}
   * @returns Promise<string>
   */
  dummyFunction(arg1: string, arg2: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        console.log(arg1, arg2)
        // const [attachment, media] = await Promise.all([
        //   some_call_1, some_call_2
        // ])
        resolve('Successful!')
      } catch (err: any) {
        reject(err)
      }
    })
  }
}
