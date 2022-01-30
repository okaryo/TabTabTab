import { Tab } from './Tab'
import { TbWindow } from './Window'

// NOTE: 'Tb' is a prefix to avoid class name conflict with other libraries.
export class TbWindows {
  constructor(
    private values: TbWindow[]
  ) {}

  static empty(): TbWindows { return new TbWindows([]) }
}
