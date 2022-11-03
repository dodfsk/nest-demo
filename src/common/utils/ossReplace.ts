export  const ImgToOss=(data:string)=>{
    const regStr=`<img [^>]*src=['"]${process.env.NGINX_OSS_MINIO}`
    // const regStr=`<img [^>]*src=['"]([^'"]+)[^>]*>`
    const regex=new RegExp(regStr,'g')

    //只修改  <img src="http:192.168.x.x   前缀为@oss
    const oss='@oss'
    const imgSrc="<img src=\""+oss
    // console.log(oss,imgSrc);
    return data.replace(regex,imgSrc)
}

export  const ImgReplace=(data:string)=>{
    const regex= /<img [^>]*src=['"]@oss/g
    //只修改  <img src="oss   前缀为oss地址
    // const a=/[o][s][s]/
    const oss:string=process.env.NGINX_OSS_MINIO
    const imgSrc="<img src=\""+oss
    // console.log(oss,imgSrc);
    return data.replace(regex,imgSrc)
}


export  const UrlToOss=(data:string)=>{
    const regStr=`${process.env.NGINX_OSS_MINIO}`
    // const regStr=`<img [^>]*src=['"]([^'"]+)[^>]*>`
    const regex=new RegExp(regStr,'g')

    //只修改  http:192.168.x.x   前缀为@oss
    const oss='@oss'
    // console.log(oss,imgSrc);
    return data.replace(regex,oss)
}

export  const UrlReplace=(data:string)=>{
    const regex=/@oss/g
    //只修改oss前缀为oss地址
    const oss:string=process.env.NGINX_OSS_MINIO
    // console.log(oss,imgSrc);
    return data.replace(regex,oss)
}


//将本地oss预签名的endPoint+端口替换为nginx代理的oss地址
export const preSignReplace=(data:string)=>{
    const regStr=`${process.env.ORIGI_OSS_MINIO}`
    const regex=new RegExp(regStr,'g')
    const oss:string=process.env.NGINX_OSS_MINIO
    // 修改oss预签名域名为nginx代理的oss地址
    return data.replace(regex,oss)
}

