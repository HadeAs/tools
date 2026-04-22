import yaml from 'js-yaml'

export type Mode = 'json-to-yaml' | 'yaml-to-json'

export function jsonToYaml(input: string): string {
  const obj = JSON.parse(input)
  return yaml.dump(obj, { indent: 2, lineWidth: -1 }).trimEnd()
}

export function yamlToJson(input: string): string {
  const obj = yaml.load(input)
  return JSON.stringify(obj, null, 2)
}

export function convert(input: string, mode: Mode): string {
  if (mode === 'json-to-yaml') return jsonToYaml(input)
  return yamlToJson(input)
}
