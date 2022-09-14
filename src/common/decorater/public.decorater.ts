//自定义装饰器

import { SetMetadata } from '@nestjs/common';
import { Role } from '@/interface/common';

export const PUBLIC_FLAG = 'isPublic';
export const Public = () => SetMetadata(PUBLIC_FLAG, true);
