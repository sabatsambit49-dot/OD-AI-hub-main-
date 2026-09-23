from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.problem_statement import ProblemStatement
from app.schemas.problem_statement import ProblemStatementCreate, ProblemStatementUpdate


def get_problem_statement(db: Session, id: int) -> Optional[ProblemStatement]:
    return db.query(ProblemStatement).filter(ProblemStatement.id == id).first()


def get_problem_statements(
    db: Session,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    has_pdf: Optional[bool] = None,
    has_text: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100
) -> List[ProblemStatement]:
    query = db.query(ProblemStatement)

    if category:
        query = query.filter(func.lower(ProblemStatement.category) == func.lower(category))
    if difficulty:
        query = query.filter(func.lower(ProblemStatement.difficulty) == func.lower(difficulty))
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            func.lower(ProblemStatement.title).ilike(search_term) |
            func.lower(ProblemStatement.description).ilike(search_term) |
            func.lower(ProblemStatement.organization).ilike(search_term)
        )
    if has_pdf is True:
        query = query.filter(ProblemStatement.file_url.isnot(None), ProblemStatement.file_url != "")
    if has_text is True:
        query = query.filter(ProblemStatement.description.isnot(None), ProblemStatement.description != "")

    return query.order_by(ProblemStatement.id.desc()).offset(skip).limit(limit).all()


def get_problem_statements_count(
    db: Session,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    has_pdf: Optional[bool] = None,
    has_text: Optional[bool] = None
) -> int:
    query = db.query(func.count(ProblemStatement.id))

    if category:
        query = query.filter(func.lower(ProblemStatement.category) == func.lower(category))
    if difficulty:
        query = query.filter(func.lower(ProblemStatement.difficulty) == func.lower(difficulty))
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            func.lower(ProblemStatement.title).ilike(search_term) |
            func.lower(ProblemStatement.description).ilike(search_term) |
            func.lower(ProblemStatement.organization).ilike(search_term)
        )
    if has_pdf is True:
        query = query.filter(ProblemStatement.file_url.isnot(None), ProblemStatement.file_url != "")
    if has_text is True:
        query = query.filter(ProblemStatement.description.isnot(None), ProblemStatement.description != "")

    return query.scalar() or 0


def get_problem_statement_categories(db: Session) -> List[str]:
    rows = db.query(ProblemStatement.category).filter(
        ProblemStatement.category.isnot(None),
        ProblemStatement.category != ""
    ).distinct().all()
    return sorted([r[0] for r in rows if r[0]])


def create_problem_statement(db: Session, statement_in: ProblemStatementCreate) -> ProblemStatement:
    db_statement = ProblemStatement(
        title=statement_in.title,
        category=statement_in.category,
        organization=statement_in.organization,
        difficulty=statement_in.difficulty,
        description=statement_in.description,
        file_url=statement_in.file_url
    )
    db.add(db_statement)
    db.commit()
    db.refresh(db_statement)
    return db_statement


def update_problem_statement(
    db: Session,
    id: int,
    statement_in: ProblemStatementUpdate
) -> Optional[ProblemStatement]:
    db_statement = get_problem_statement(db, id)
    if not db_statement:
        return None

    if statement_in.title is not None:
        db_statement.title = statement_in.title
    if statement_in.category is not None:
        db_statement.category = statement_in.category
    if statement_in.organization is not None:
        db_statement.organization = statement_in.organization
    if statement_in.difficulty is not None:
        db_statement.difficulty = statement_in.difficulty
    if statement_in.description is not None:
        db_statement.description = statement_in.description
    if statement_in.file_url is not None:
        db_statement.file_url = statement_in.file_url if statement_in.file_url != "__REMOVE__" else None

    db.commit()
    db.refresh(db_statement)
    return db_statement


def delete_problem_statement(db: Session, id: int) -> bool:
    db_statement = get_problem_statement(db, id)
    if not db_statement:
        return False
    db.delete(db_statement)
    db.commit()
    return True
