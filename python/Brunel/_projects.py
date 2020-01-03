
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
            return

        if isinstance(project, str):
            # try to find an existing project with this name
            try:
                return self.getByName(project)
            except Exception:
                return self.add(_Project({"name": project}))

        if not isinstance(project, _Project):
            raise TypeError("Can only add a Project to Projects")

        try:
            return self.getByName(project.getName())
        except Exception:
            pass

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
