
from ._person import *
from ._people import *
from ._connection import *
from ._connections import *
from ._business import *
from ._businesses import *
from ._affiliation import *
from ._affiliations import *
from ._position import *
from ._positions import *
from ._source import *
from ._sources import *
from ._note import *
from ._notes import *
from ._project import *
from ._projects import *
from ._social import *
from ._daterange import *
from ._dry import *


try:
    if __IPYTHON__:
        def _set_printer(C):
            """Function to tell ipython to use __str__ if available"""
            get_ipython().display_formatter.formatters['text/plain'].for_type(
                C,
                lambda obj, p, cycle: p.text(str(obj) if not cycle else '...')
                )

        import sys as _sys
        import inspect as _inspect

        _clsmembers = _inspect.getmembers(_sys.modules[__name__],
                                          _inspect.isclass)

        for _clsmember in _clsmembers:
            _set_printer(_clsmember[1])
except Exception:
    pass
