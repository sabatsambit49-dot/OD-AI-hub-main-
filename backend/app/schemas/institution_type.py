from pydantic import BaseModel

class InstitutionTypeBase(BaseModel):
    name: str

class InstitutionTypeCreate(InstitutionTypeBase):
    pass

class InstitutionTypeUpdate(InstitutionTypeBase):
    pass

class InstitutionTypeResponse(InstitutionTypeBase):
    id: int

    class Config:
        from_attributes = True
