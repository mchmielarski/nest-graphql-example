import 'reflect-metadata';
import { PipeTransform } from '@nestjs/common';
import { isNil, isString } from '@nestjs/common/utils/shared.utils';

import { RESOLVER_PARAMS_METADATA } from '../graphql.constants';
import { ResolverParamtype } from '../enums/resolver-paramtype.enum';

export type ParamData = object | string | number;

export interface ResolverParamMetadata {
  paramtype: ResolverParamtype;
  data?: ParamData;
  pipes?: PipeTransform<any>[];
}

const assignMetadata = (
  params: ResolverParamMetadata[],
  paramtype: ResolverParamtype,
  data?: ParamData,
  ...pipes: PipeTransform<any>[]
) => [
  ...params,
  {
    paramtype,
    data,
    pipes
  }
];

const createResolverParamDecorator = (paramtype: ResolverParamtype) => {
  return (data?: ParamData): ParameterDecorator => (target, key, index) => {
    const params = Reflect.getMetadata(RESOLVER_PARAMS_METADATA, target, key) || [];
    Reflect.defineMetadata(
      RESOLVER_PARAMS_METADATA,
      assignMetadata(params, paramtype, data),
      target,
      key
    );
  };
};

const createPipesResolverParamDecorator = (paramtype: ResolverParamtype) => (
  data?: string | PipeTransform<any>,
  ...pipes: PipeTransform<any>[]
): ParameterDecorator => (target, key, index) => {
  const params = Reflect.getMetadata(RESOLVER_PARAMS_METADATA, target, key) || [];
  const hasParamData = isNil(data) || isString(data);
  const paramData = hasParamData ? data : undefined;
  const paramPipes = hasParamData ? pipes : [data as PipeTransform<any>, ...pipes];

  Reflect.defineMetadata(
    RESOLVER_PARAMS_METADATA,
    assignMetadata(params, paramtype, paramData, ...paramPipes),
    target,
    key
  );
};

export const Context: () => ParameterDecorator = createResolverParamDecorator(
  ResolverParamtype.CONTEXT
);

export const Parent: () => ParameterDecorator = createResolverParamDecorator(
  ResolverParamtype.PARENT
);

export function Arg(property?: string | PipeTransform<any>, ...pipes: PipeTransform<any>[]) {
  return createPipesResolverParamDecorator(ResolverParamtype.ARG)(property, ...pipes);
}
