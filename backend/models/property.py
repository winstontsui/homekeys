from mongoengine import Document, StringField, IntField, FloatField, ListField, EmbeddedDocument, EmbeddedDocumentField

class FinancialInfo(EmbeddedDocument):
    monthly_ground_rent = FloatField()
    lease_type = StringField()
    monthly_hoa_fees = FloatField(null=True)


class Property(Document):
    address = StringField(required=True)
    price = IntField(required=True)
    bedrooms = IntField(required=True)
    bathrooms = FloatField(required=True)  # Use FloatField for 2.5 baths
    square_footage = IntField(required=True)
    lot_size = IntField(null=True)
    garage = IntField()
    description = StringField()
    amenities = ListField(StringField())
    financial = EmbeddedDocumentField(FinancialInfo)

    meta = {'collection': 'properties'}  # optional: name of the collection
