# Librum

A tabletop RPG campaign companion.

## Data

Use the `data:load` task to import fixture data.

```bash
bundle exec thor data:load --data-path="data/fixtures" --core
```

You must specify which groups of data files to load by passing options to `thor`:

- `--authentication`: Loads data related to authentication, such as `User`s and `Credential`s.
- `--core`: Loads the core data classes relevant to all games, such as `Publisher`s and sources.
- `--dnd5e`: Loads game data for Dungeons and Dragons, 5th Edition.

## Development Resources

### Client

- CSS Framework:
  - [Bulma](https://bulma.io/documentation/)
- Icons:
  - [FontAwesome Icons](https://fontawesome.com/search?m=free)
