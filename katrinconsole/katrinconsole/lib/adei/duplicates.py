import pandas as pd
from .metadata import get_adei_channels, get_adei_item_url


def get_adei_duplicate_items(user, password, ):
    items = get_adei_channels(user, password)
    df = pd.DataFrame(items)
    dup = df[df['uid'].duplicated(keep=False)].groupby('uid')
    total_dup = 0
    unique_dup = 0
    duplicates = []
    for key, items in dup:
        if key:
            length = len(items)
            total_dup += length
            unique_dup += 1
            channel = {
                'total': length,
                'channel_uid': key,
                'duplicates': [{
                    'url': get_adei_item_url(row["db_server"], row["db_name"], row["db_group"]),
                    'uid': row['uid'],
                    'chid': row['chid'],
                    'db_server': row["db_server"],
                    'db_name': row["db_name"],
                    'db_group': row["db_group"],
                } for _, row in items.iterrows()]
            }
        duplicates.append(channel)

    return {
        'total': total_dup,
        'unique_channels': unique_dup,
        'duplicates': duplicates
    }
