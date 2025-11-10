import { UniqueId } from './value-objects/unique-id.value-object.js';

export abstract class Entity<Props> {
  private _id: UniqueId;
  protected props: Props;

  get id(): UniqueId {
    return this._id;
  }

  protected constructor(props: Props, id?: UniqueId) {
    this._id = id ?? new UniqueId(id);
    this.props = props;
  }

  public equals(entity: Entity<unknown>) {
    if (entity === this) {
      return true;
    }

    if (entity.id === this._id) {
      return true;
    }

    return false;
  }
}
