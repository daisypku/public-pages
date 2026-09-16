"""Optional enrichment boundary. No model SDK, credential lookup, or HTTP calls.

Future providers implement Enricher.enrich(report) and return annotations keyed by
event key. Annotations never overwrite numerical observations. Enabling a provider
requires an explicit configuration/code change; the daily default is a no-op.
"""
from typing import Protocol

class Enricher(Protocol):
    def enrich(self, report: dict) -> dict:
        """Return {event_key: {summary: str, sources: [{title, url}]}}."""
        ...

def enrich(report: dict, config: dict, provider: Enricher | None = None) -> dict:
    if not config.get('model', {}).get('enabled', False):
        return {'enabled': False, 'annotations': {}}
    if provider is None:
        raise RuntimeError('Model enrichment enabled but no provider explicitly configured')
    return {'enabled': True, 'annotations': provider.enrich(report)}
