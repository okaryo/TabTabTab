import { GroupId } from './GroupId';
import { Tab } from './Tab'

export class GroupedTabs {
  constructor(
    private id: GroupId,
    private name: string,
    private values: Tab[],
  ) {}
}
