
__all__ = ["stringify"]


def _stringify(obj):
    if hasattr(obj, "toDry"):
        state = obj.toDry()
        value = _stringify(state)

        if value:
            return {'dry_class': obj.__class__.__name__,
                    'dry': "toDry",
                    'drypath': [],
                    'value': value}
        else:
            return None
    elif isinstance(obj, dict):
        value = {}

        for key in obj.keys():
            val = _stringify(obj[key])
            if val:
                value[key] = val

        if len(value) > 0:
            return value
        else:
            return None
    elif isinstance(obj, list):
        value = []

        for val in obj:
            v = _stringify(val)
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
    return _json.dumps(_stringify(obj))
