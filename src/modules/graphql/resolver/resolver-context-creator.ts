import 'reflect-metadata';
import { GuardsContextCreator } from '@nestjs/core/guards/guards-context-creator';
import { GuardsConsumer } from '@nestjs/core/guards/guards-consumer';
import { InterceptorsContextCreator } from '@nestjs/core/interceptors/interceptors-context-creator';
import { InterceptorsConsumer } from '@nestjs/core/interceptors/interceptors-consumer';
import { Controller } from '@nestjs/common/interfaces';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards/constants';
import { HttpStatus, HttpException } from '@nestjs/common';
import { Module } from '@nestjs/core/injector/module';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';

import { ResolverParamtype } from '../enums/resolver-paramtype.enum';
import { RESOLVER_PARAMS_METADATA } from '../graphql.constants';

const createResolverParam = (
  key: ResolverParamtype | string,
  data,
  { parent, args, context },
) => {
  switch (key) {
    case ResolverParamtype.PARENT:
      return parent;
    case ResolverParamtype.CONTEXT:
      return context;
    case ResolverParamtype.ARG:
      return data && args ? args[data] : args;
    default:
      return null;
  }
};

export class ResolverContextCreator {

  static fromExternalContextCreator(externalContextCreator: ExternalContextCreator) {
    const src: any = externalContextCreator;
    return new ResolverContextCreator(
      src.guardsContextCreator,
      src.guardsConsumer,
      src.interceptorsContextCreator,
      src.interceptorsConsumer,
      src.modulesContainer
    );
  }

  constructor(
    private readonly guardsContextCreator: GuardsContextCreator,
    private readonly guardsConsumer: GuardsConsumer,
    private readonly interceptorsContextCreator: InterceptorsContextCreator,
    private readonly interceptorsConsumer: InterceptorsConsumer,
    private readonly modulesContainer: ModulesContainer,
  ) {}

  public create(
    instance: Controller,
    callback: (...args) => any,
    methodName: string,
  ) {
    const paramsMetadata = Reflect.getMetadata(RESOLVER_PARAMS_METADATA, instance, methodName) || [];

    const module = this.findContextModuleName(instance.constructor);
    const guards = this.guardsContextCreator.create(instance, callback, module);
    const interceptors = this.interceptorsContextCreator.create(
      instance,
      callback,
      module,
    );
    return async (...handlerArgs) => {
      const [parent, args, context] = handlerArgs;

      const canActivate = await this.guardsConsumer.tryActivate(
        guards,
        context,
        instance,
        callback,
      );
      if (!canActivate) {
        throw new HttpException(FORBIDDEN_MESSAGE, HttpStatus.FORBIDDEN);
      }
      const params = paramsMetadata.map(meta => createResolverParam(meta.paramtype, meta.data, { parent, args, context }));
      const handler = () => callback.apply(instance, params);
      return await this.interceptorsConsumer.intercept(
        interceptors,
        handlerArgs,
        instance,
        callback,
        handler,
      );
    };
  }

  public findContextModuleName(constructor: Function): string {
    const className = constructor.name;
    if (!className) {
      return '';
    }
    for (const [key, module] of [...this.modulesContainer.entries()]) {
      if (this.findComponentByClassName(module, className)) {
        return key;
      }
    }
    return '';
  }

  public findComponentByClassName(module: Module, className: string): boolean {
    const { components } = module;
    const hasComponent = [...components.keys()].find(
      component => component === className,
    );
    return !!hasComponent;
  }
}
