//返给前端res.data的对象类型
export interface ResponseData<T=Object> {
  data: T; // 默认结果为空对象
  message: string; // 正确/错误提示
  meta?: string; //正确/错误副提示
  code: number; // 自定义code
  timestamp?: number;
  url?: string; // 正确/错误的url地址
}

//用户角色的类型
export type Role = 'root' | 'admin' | 'user';
