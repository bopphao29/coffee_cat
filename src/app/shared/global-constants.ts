export class GlobalConstants{
    public static genericError: string = "Có gì đó không ổn, vui lòng thử lại sau!";

    // public static nameRegex: string = "[a-zA-Z0-9 ]*"

    public static nameRegex: string = "^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠ-ỹ\s]+$"

    public static productAded: string = "Thêm thành công"

    public static productExitError: string = "Đã tồn tại"

    public static emailRegex: string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}"

    public static contactNumberRegex: string = "^[e0-9]{10,10}$"

    public static error:string = "Lỗi"

    public static unauthroized = "Không đúng authorized"
}