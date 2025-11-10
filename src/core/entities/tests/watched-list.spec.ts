import { WatchedList } from '../watched-list.js';

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b;
  }
}

describe('WatchedList', () => {
  it('should initialize with no items', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    expect(list.getItems()).toHaveLength(3);
    expect(list.getItems()).toEqual([1, 2, 3]);
  });

  it('should be able to add new items', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.add(4);

    expect(list.getItems()).toHaveLength(4);
    expect(list.getItems()).toEqual([1, 2, 3, 4]);
  });

  it('should be able to remove items', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.remove(2);

    expect(list.getItems()).toHaveLength(2);
    expect(list.getItems()).toEqual([1, 3]);
  });

  it('should be able to add an item even after removing it', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.remove(2);
    list.add(2);

    expect(list.getNewItems()).toEqual([]);
    expect(list.getRemovedItems()).toEqual([]);

    expect(list.getItems()).toHaveLength(3);
    expect(list.getItems()).toEqual([1, 3, 2]);
  });

  it('should be able to remove an item even after adding it', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.add(4);
    list.remove(4);

    expect(list.getNewItems()).toEqual([]);
    expect(list.getRemovedItems()).toEqual([]);

    expect(list.getItems()).toHaveLength(3);
    expect(list.getItems()).toEqual([1, 2, 3]);
  });

  it('should be able to update watched list', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.update([2, 3, 4, 5]);

    expect(list.getNewItems()).toEqual([4, 5]);
    expect(list.getRemovedItems()).toEqual([1]);

    expect(list.getItems()).toHaveLength(4);
    expect(list.getItems()).toEqual([2, 3, 4, 5]);
  });
});
