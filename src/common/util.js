export function urlMatcher(url, params) {
  return url.replace(/:([^/]+)/g, (match, g1) => {
    return params[g1]
  })
}
