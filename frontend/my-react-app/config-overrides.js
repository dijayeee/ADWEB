module.exports = function override(config, env) {
  // Ignore source map errors for react-router-dom
  config.module.rules = config.module.rules.map(rule => {
    if (rule.enforce === 'pre' && rule.loader && rule.loader.includes('source-map-loader')) {
      return {
        ...rule,
        exclude: /node_modules[\/\\]react-router-dom/,
      };
    }
    if (rule.oneOf) {
      rule.oneOf = rule.oneOf.map(oneOfRule => {
        if (oneOfRule.loader && oneOfRule.loader.includes('source-map-loader')) {
          return {
            ...oneOfRule,
            exclude: /node_modules[\/\\]react-router-dom/,
          };
        }
        return oneOfRule;
      });
    }
    return rule;
  });
  
  return config;
};

