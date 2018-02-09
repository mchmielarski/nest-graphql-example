import { ResolverParamtype } from '../enums/resolver-paramtype.enum';

export class ResolverParamsFactory {
  public exchangeKeyForValue(
    key: ResolverParamtype | string,
    data,
    { parent, args, context },
  ) {
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
  }
}
