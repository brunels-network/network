
__all__ = ["stringify"]


def _stringify(obj, drypath=[]):
    import copy as _copy
    drypath = _copy.copy(drypath)

    if hasattr(obj, "toDry"):
        state = obj.toDry()
        drypath.append("value")
        value = _stringify(state, drypath)
        drypath.pop()

        if value:
            return {'dry_class': obj.__class__.__name__,
                    'dry': "toDry",
                    'drypath': drypath,
                    'value': value}
        else:
            return None
    elif isinstance(obj, dict):
        value = {}

        for key in obj.keys():
            drypath.append(key)
            val = _stringify(obj[key], drypath)
            drypath.pop()
            if val:
                value[key] = val

        if len(value) > 0:
            return value
        else:
            return None
    elif isinstance(obj, list):
        value = []

        for i in range(0, len(obj)):
            drypath.append(i)
            v = _stringify(obj[i], drypath)
            drypath.pop()
            if v:
                value.append(v)

        if len(value) > 0:
            return value
        else:
            return None
    else:
        return obj


def stringify(obj):
    import json as _json
    return _json.dumps(_stringify(obj, []))
