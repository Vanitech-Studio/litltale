export function parseTheme(data) {

  const theme = data.reduce((acc, cur) => {
    acc[cur.name] = cur.value;
    return acc;
  }, {});

  return theme;
  }