<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class EventoCambioInputs implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $field;
    public string|int $value;
    public ?string $formType;
    public string $placa;
    public string $userName;


    public function __construct(string $field, string|int $value, ?string $formType = null, string $placa, string $userName)
    {
        $this->field = $field;
        $this->value = $value;
        $this->formType = $formType;
        $this->placa = $placa;
        $this->userName = $userName;
    }

    public function broadcastOn(): array
    {
        return [new Channel('admin.dashboard')];
    }

    public function broadcastAs(): string
    {
        return 'input.changed';
    }
}
