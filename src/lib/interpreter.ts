// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Interpreter from 'sciolyff/interpreter';

export function getInterpreter(yaml: string) {
	return new Interpreter(yaml);
}