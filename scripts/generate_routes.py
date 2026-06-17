import json
import os


BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)


groups_path = os.path.join(
    BASE_DIR,
    "data",
    "green_commute_groups.json"
)


coords_path = os.path.join(
    BASE_DIR,
    "data",
    "zip_coordinates.json"
)


groups = json.load(
    open(groups_path)
)


coords = json.load(
    open(coords_path)
)


for group in groups:

    zip_code = group["zip_code"]


    location = next(
        x for x in coords
        if x["zip_code"] == zip_code
    )


    print(
        f"""
Green Route:

ZIP:
{zip_code}

Students:
{group['students']}

CO2 Saved:
{group['co2_saved']} kg

Location:
{location['lat']}, {location['lng']}

"""
    )