
from ._project import Project as _Project

__all__ = ["Projects"]


def _generate_source_uid():
    import uuid as _uuid
    uid = _uuid.uuid4()
    return "J" + str(uid)[:7]


class Projects:
    """This holds a registry of individual Projects"""
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "registry": {},
        }

        self._names = {}

        self.load(props)

    def add(self, project: _Project):
        if project is None:
            return None

        if isinstance(project, str):
            if len(project) == 0:
                return None

            # Try to find an existing project with this name
            try:
                return self.getByName(project)
            except Exception:
                return self.add(_Project({"name": project}))

        if not isinstance(project, _Project):
            raise TypeError("Can only add a Project to Projects")

        existing = None

        try:
            existing = self.getByName(project.getName())
        except Exception:
            pass

        if existing:
            existing = existing.merge(project)
            self.state["registry"][existing.getID()] = existing
            return existing

        id = project.getID()

        if id:
            if id in self.state["registry"]:
                raise KeyError(f"Duplicate Project ID {project}")

            self.state["registry"][id] = project
        else:
            uid = _generate_source_uid()

            while uid in self.state["registry"]:
                uid = _generate_source_uid()

            project.state["id"] = uid
            self.state["registry"][uid] = project

        project._getHook = self._getHook
        self._names[project.getName()] = project.getID()
        return project

    def getByName(self, name):
        try:
            return self.get(self._names[name])
        except Exception:
            raise KeyError(f"No Source with name {name}")

    def find(self, value):
        if isinstance(value, _Project):
            return self.get(value.getID())

        value = value.lstrip().rstrip().lower()

        results = []

        for name in self._names.keys():
            if name.lower().find(value) != -1:
                results.append(self.get(self._names[name]))

        if len(results) == 1:
            return results[0]
        elif len(results) > 1:
            return results

        keys = "', '".join(self._names.keys())

        raise KeyError(f"No project matches '{value}'. Available projects are '{keys}'")

    def get(self, id):
        try:
            return self.state["registry"][id]
        except Exception:
            raise KeyError(f"No Note with ID {id}")

    def load(self, data):
        if data:
            for item in data:
                note = _Project.load(item)
                self.add(note)

    def toDry(self):
        return self.state

    @staticmethod
    def unDry(value):
        projects = Projects()
        projects.state = value

        return projects
