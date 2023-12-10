# nautobot-map
Nautobot plugin to add a page with a map of Locations

### Installation
- clone repo
- `cd nautobot-map`
- activate Nautobot's venv
- `pip install .`
- add `nautobot_map` in the PLUGINS section of your `nautobot_config.py`
- from your NAUTOBOT_ROOT `nautobot-server migrate nautobot_map`
- `nautobot-server collectstatic`

You can then view the map at plugins/map/