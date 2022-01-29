import { TabId } from './TabId'

export class Tab {
  constructor(
    private id: TabId,
    private title: string,
    private favIconUrl: string,
    private isFocused: boolean
  ) {}
}
