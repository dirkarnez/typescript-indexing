interface PhoneBookEntry {
  name: string;
  phoneNumber: string;
}

interface ICountedFilter<T> {
    countedFilter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: Array<T>): [Array<T>, number]
}

class CountedFilter<T> implements ICountedFilter<T> {
    protected array: Array<T>;
    constructor(array: Array<T>) {
        this.array = array;
    }
  // Override the push method to perform additional actions
  countedFilter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: Array<T>): [Array<T>, number]
  {
    debugger;
    let counted = 0;
    
    const filtered = this.array.filter((_value, _index, _array) => {
        counted++;
        return predicate(_value, _index, _array);
    });
    debugger;
    return [
        new Array<T>(...(filtered ? filtered : [])), 
        counted
    ];
  }

}




class IndexedCustomArray<T> extends CountedFilter<T> {
  private index: Map<T[keyof T], Array<T>> = new Map();
  private array: Array<T>

  constructor(array: Array<T>, getKey: () => keyof T, processor: (subIndexArray: Array<T>) => void) {
    super(array);
    this.array = array;
    this.buildIndex(array, getKey, processor);
  }

  buildIndex(array: Array<T>, getKey: () => keyof T, processor: (subIndexArray: Array<T>) => void): void {
    for (const entry of array) {
      const valueAsIndexKey = entry[getKey()]; //.toUpperCase();
      
      if (!this.index.has(valueAsIndexKey)) {
        this.index.set(valueAsIndexKey, new Array<T>(...[]));
      }

      const value = this.index.get(valueAsIndexKey);
      this.index.set(valueAsIndexKey, value ? value : new Array<T>(...[]));
    }
    
    for (const key of this.index.keys()) {
        const value = this.index.get(key);
        const nonnull = value ? value : new Array<T>(...[]);
        processor(nonnull);
        this.index.set(key, nonnull);
    }
  }
}

const raw = [  
    { name: 'John Doe', phoneNumber: '123-456-7890' },
    { name: 'Jane Smith', phoneNumber: '987-654-3210' },
    { name: 'Alice Johnson', phoneNumber: '555-123-4567' }
];
// Usage
const phoneBook = new CountedFilter<PhoneBookEntry>(raw);

const [result, counted] = phoneBook.countedFilter(
  record => {
    return record.name == "Jane Smith";
});

console.log(`[result ${result.length}, counted ${counted}]`);
debugger;
const indexed = new IndexedCustomArray(raw, () => "name", (arrays) => arrays.sort((a, b) => a.name.localeCompare(b.name)));
debugger

const [resultIndexed, countedIndexed] = indexed.countedFilter(record => {
    return record.name == "Jane Smith";
});
console.log(`[resultIndexed ${resultIndexed.length}, countedIndexed ${countedIndexed}]`);

// debugger;

