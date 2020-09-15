// Autobind Decorator
export function Binder(_: any, _2: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  const adjustDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const configFn = method.bind(this);
      return configFn;
    },
  };
  return adjustDescriptor;
}
