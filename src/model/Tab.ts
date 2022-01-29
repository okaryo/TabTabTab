import { TabId } from './TabId'

export class Tab {
  constructor(
    private id: TabId,
    private title: String,
    private favIconUrl: String,
    private isFocused: boolean
  ) {}
}
