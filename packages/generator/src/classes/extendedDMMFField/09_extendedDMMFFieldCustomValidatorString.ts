import type DMMF from '@prisma/dmmf';
import { ExtendedDMMFFieldValidatorString } from './08_extendedDMMFFieldValidatorString';
import { GeneratorConfig } from '../../schemas';

/////////////////////////////////////////////////
// CLASS
/////////////////////////////////////////////////

export class ExtendedDMMFFieldCustomValidatorString extends ExtendedDMMFFieldValidatorString {
  readonly zodCustomValidatorString?: string;

  constructor(
    field: DMMF.Field,
    generatorConfig: GeneratorConfig,
    modelName: string,
  ) {
    super(field, generatorConfig, modelName);

    this.zodCustomValidatorString = this._getZodCustomValidatorString();
  }

  // GET CUSTOM VALIDATOR STRING
  // ----------------------------------------------

  private _getZodCustomValidatorString() {
    if (!this._validatorType || this._validatorType !== 'custom')
      return this.zodCustomValidatorString;

    return this._validatorIsValid()
      ? this._extractUsePattern()
      : this.zodCustomValidatorString;
  }

  // HELPER
  // ----------------------------------------------

  private _extractUsePattern() {
    const entry = this._getZodValidatorListWithoutArray()?.find((p) =>
      p.includes('.use('),
    );
    if (!entry) return undefined;
    const start = entry.indexOf('.use(');
    if (start === -1) return undefined;
    const from = start + '.use('.length;
    // Extract content inside .use( ... ) with balanced parentheses
    let depth = 1;
    let i = from;
    while (i < entry.length && depth > 0) {
      const ch = entry[i++];
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
    }
    const end = i - 1;
    if (depth !== 0 || end <= from) return undefined;
    const content = entry.slice(from, end);
    return content;
  }
}
