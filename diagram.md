+-----------+        +----------+       +--------------+
| authors   |        |book_authors|     |   books      |
+-----------+        +----------+       +--------------+
| id (PK)   |<----->| author_id (FK)    | id (PK)       |
| name      |       | book_id (FK) <--->| genre_id (FK) |
| bio       |       +----------+        | title         |
+-----------+                            | quantity      |
                                         | description   |
                                         | cover_image   |
                                         +--------------+
                                               |
                                               V
                                          +------------+
                                          |  genres    |
                                          +------------+
                                          | id (PK)    |
                                          | name       |
                                          | desc       |
                                          +------------+