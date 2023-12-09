from nautobot.apps import NautobotAppConfig

class NautobotMapConfig(NautobotAppConfig):
    name = 'nautobot_map'
    verbose_name = 'Map for Nautobot Locations'
    description = 'Adds a page with a map of all Nautobot Locations'
    version = '0.1'
    author = 'Alexis Panagiotopoulos'
    author_email = 'apanagio@enomix.gr'
    base_url = 'map'
    required_settings = []
    default_settings = {}

config = NautobotMapConfig