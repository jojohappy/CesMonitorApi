from django.db import models

class groups(models.Model):
    groupid=models.IntegerField(primary_key=True)
    internal=models.IntegerField()
    name=models.CharField(max_length=64)

    class Meta:
        db_table = 'groups'

    def __unicode__(self):
        return self.name