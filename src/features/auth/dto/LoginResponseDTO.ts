export interface UserDTO{
    id:string;
    username:string;
    email:string;
    role?:string;
}

export interface LoginResponseDTO{
    user:UserDTO;
    access_token:string;
}