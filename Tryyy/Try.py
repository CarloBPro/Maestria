import contextlib
import sys
import time

from random import *
from Expert import *


class info:
    def _init_ (self,name,age,sex,):
        self.name = name
        self.age =age
        self.age= age


class reaction:
    @Rule(info(color="red"))
    def red_color